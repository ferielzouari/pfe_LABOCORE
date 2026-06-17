package com.clinisys.labocore.service;

import com.clinisys.labocore.dto.ChatMessageDto;
import com.clinisys.labocore.dto.ChatResponseDto;
import com.clinisys.labocore.entity.BonReception;
import com.clinisys.labocore.entity.BonReceptionArticle;
import com.clinisys.labocore.entity.Echantillon;
import com.clinisys.labocore.entity.Fournisseur;
import com.clinisys.labocore.entity.MouvementStock;
import com.clinisys.labocore.entity.StockEntity;
import com.clinisys.labocore.entity.Technicien;
import com.clinisys.labocore.repository.BonReceptionArticleRepository;
import com.clinisys.labocore.repository.BonReceptionRepository;
import com.clinisys.labocore.repository.EchantillonRepository;
import com.clinisys.labocore.repository.FournisseurRepository;
import com.clinisys.labocore.repository.MouvementStockRepository;
import com.clinisys.labocore.repository.StockRepository;
import com.clinisys.labocore.repository.TechnicienRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatServiceImpl implements ChatService {

    private static final org.slf4j.Logger log =
            org.slf4j.LoggerFactory.getLogger(ChatServiceImpl.class);

    private static final String SYSTEM_PROMPT = """
            You are LABOCORE Assistant, an AI integrated into a laboratory information \
            management system at IIT Sfax, Tunisia. Help lab staff with stock levels, \
            articles, suppliers, movements, samples, and technicians. Always use tools \
            to get real data — never invent numbers. Respond in the same language the \
            user writes in. Be concise and professional.""";

    private static final int MAX_TOOL_ROUNDS = 3;

    private static final List<Map<String, Object>> FUNCTION_DECLARATIONS = buildFunctionDeclarations();

    private final StockRepository stockRepository;
    private final BonReceptionArticleRepository bonReceptionArticleRepository;
    private final BonReceptionRepository bonReceptionRepository;
    private final FournisseurRepository fournisseurRepository;
    private final MouvementStockRepository mouvementStockRepository;
    private final EchantillonRepository echantillonRepository;
    private final TechnicienRepository technicienRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api-key:}")
    private String apiKey;

    @Value("${gemini.api-url:}")
    private String apiUrl;

    public ChatServiceImpl(
            StockRepository stockRepository,
            BonReceptionArticleRepository bonReceptionArticleRepository,
            BonReceptionRepository bonReceptionRepository,
            FournisseurRepository fournisseurRepository,
            MouvementStockRepository mouvementStockRepository,
            EchantillonRepository echantillonRepository,
            TechnicienRepository technicienRepository,
            RestTemplateBuilder restTemplateBuilder,
            ObjectMapper objectMapper) {
        this.stockRepository = stockRepository;
        this.bonReceptionArticleRepository = bonReceptionArticleRepository;
        this.bonReceptionRepository = bonReceptionRepository;
        this.fournisseurRepository = fournisseurRepository;
        this.mouvementStockRepository = mouvementStockRepository;
        this.echantillonRepository = echantillonRepository;
        this.technicienRepository = technicienRepository;
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10_000);
        factory.setReadTimeout(30_000);
        this.restTemplate = restTemplateBuilder.requestFactory(() -> factory).build();
        this.objectMapper = objectMapper;
    }

    @Override
    public ChatResponseDto sendMessage(List<ChatMessageDto> messages) {
        if (!isConfigured()) {
            return new ChatResponseDto("AI Assistant is not configured yet. Please add your Gemini API key to application-local.yml");
        }
        if (messages == null || messages.isEmpty()) {
            return new ChatResponseDto("Hello! I'm the LABOCORE Assistant. Ask me about stock levels, articles, suppliers, movements, samples or technicians.");
        }

        try {
            List<Map<String, Object>> contents = buildContents(messages);

            for (int round = 0; round < MAX_TOOL_ROUNDS; round++) {
                JsonNode response = callGemini(contents);
                JsonNode parts = response.path("candidates").path(0).path("content").path("parts");

                List<JsonNode> functionCalls = new ArrayList<>();
                StringBuilder text = new StringBuilder();
                for (JsonNode part : parts) {
                    if (part.has("functionCall")) {
                        functionCalls.add(part.get("functionCall"));
                    } else if (part.has("text")) {
                        text.append(part.get("text").asText());
                    }
                }

                if (functionCalls.isEmpty()) {
                    String reply = text.toString().trim();
                    return new ChatResponseDto(!reply.isEmpty() ? reply
                            : "I'm not sure how to help with that. Try asking about stock levels, articles, suppliers, movements, samples or technicians.");
                }

                contents.add(Map.of("role", "model", "parts", objectMapper.convertValue(parts, List.class)));

                List<Object> functionResponseParts = new ArrayList<>();
                for (JsonNode call : functionCalls) {
                    String name = call.path("name").asText();
                    JsonNode args = call.path("args");
                    Object result = executeTool(name, args);
                    Map<String, Object> functionResponse = new LinkedHashMap<>();
                    functionResponse.put("name", name);
                    functionResponse.put("response", Map.of("result", result));
                    functionResponseParts.add(Map.of("functionResponse", functionResponse));
                }
                contents.add(Map.of("role", "function", "parts", functionResponseParts));
            }

            return new ChatResponseDto("I wasn't able to fully process that request. Please try rephrasing your question.");
        } catch (Exception e) {
            log.error("[ChatService] Gemini call failed: {} — {}", e.getClass().getSimpleName(), e.getMessage(), e);
            return new ChatResponseDto(
                    "Sorry, I'm having trouble connecting right now. Please try again.");
        }
    }

    // ── Gemini API plumbing ──────────────────────────────────────────────────

    private boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank() && !apiKey.startsWith("PUT_YOUR");
    }

    private List<Map<String, Object>> buildContents(List<ChatMessageDto> messages) {
        List<Map<String, Object>> contents = new ArrayList<>();
        for (ChatMessageDto m : messages) {
            String role = "assistant".equals(m.role()) ? "model" : "user";
            String content = m.content() != null ? m.content() : "";
            contents.add(Map.of("role", role, "parts", List.of(Map.of("text", content))));
        }
        return contents;
    }

    private JsonNode callGemini(List<Map<String, Object>> contents) throws Exception {
        Map<String, Object> requestBody = new LinkedHashMap<>();
        requestBody.put("contents", contents);
        requestBody.put("system_instruction", Map.of("parts", List.of(Map.of("text", SYSTEM_PROMPT))));
        requestBody.put("tools", List.of(Map.of("function_declarations", FUNCTION_DECLARATIONS)));
        requestBody.put("generationConfig", Map.of(
                "maxOutputTokens", 1024,
                "temperature", 0.2
        ));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        String url = apiUrl + "?key=" + apiKey;
        String body = restTemplate.postForObject(url, entity, String.class);

        JsonNode parsed = objectMapper.readTree(body);

        if (parsed.has("error")) {
            String errorMsg = parsed.path("error").path("message").asText("Unknown Gemini error");
            int errorCode = parsed.path("error").path("code").asInt(0);
            log.error("[ChatService] Gemini API error {}: {}", errorCode, errorMsg);
            throw new RuntimeException("Gemini API error " + errorCode + ": " + errorMsg);
        }

        return parsed;
    }

    private static List<Map<String, Object>> buildFunctionDeclarations() {
        List<Map<String, Object>> tools = new ArrayList<>();

        tools.add(Map.of(
                "name", "get_low_stock_articles",
                "description", "Get all articles where current stock (stkDep) is at or below the minimum threshold (stkMin).",
                "parameters", Map.of("type", "OBJECT", "properties", Map.of())
        ));

        tools.add(Map.of(
                "name", "get_article_info",
                "description", "Get stock information for a specific article by its exact code or by a name/keyword search.",
                "parameters", Map.of(
                        "type", "OBJECT",
                        "properties", Map.of(
                                "codart", Map.of("type", "STRING", "description", "Exact article code, e.g. ACC0001"),
                                "searchTerm", Map.of("type", "STRING", "description", "Keyword to search in the article description")
                        )
                )
        ));

        tools.add(Map.of(
                "name", "get_supplier_for_article",
                "description", "Find which supplier provides a given article code.",
                "parameters", Map.of(
                        "type", "OBJECT",
                        "properties", Map.of(
                                "codart", Map.of("type", "STRING", "description", "Article code to look up, e.g. ACC0001")
                        ),
                        "required", List.of("codart")
                )
        ));

        tools.add(Map.of(
                "name", "get_recent_movements",
                "description", "Get recent stock movements, optionally filtered by article code or movement type.",
                "parameters", Map.of(
                        "type", "OBJECT",
                        "properties", Map.of(
                                "codart", Map.of("type", "STRING", "description", "Article code to filter by"),
                                "typeMouvement", Map.of("type", "STRING", "description", "Movement type: ENTREE, SORTIE or AJUSTEMENT"),
                                "limit", Map.of("type", "INTEGER", "description", "Maximum number of movements to return (default 10)")
                        )
                )
        ));

        tools.add(Map.of(
                "name", "get_pending_samples",
                "description", "Get the count and list of samples that are currently pending.",
                "parameters", Map.of("type", "OBJECT", "properties", Map.of())
        ));

        tools.add(Map.of(
                "name", "get_stock_summary",
                "description", "Get overall stock statistics: total number of articles, number of critical (low stock) articles, and the list of article families.",
                "parameters", Map.of("type", "OBJECT", "properties", Map.of())
        ));

        tools.add(Map.of(
                "name", "get_active_technicians",
                "description", "Get all active lab technicians.",
                "parameters", Map.of("type", "OBJECT", "properties", Map.of())
        ));

        tools.add(Map.of(
                "name", "get_recent_receptions",
                "description", "Get the most recent goods reception bons (delivery slips).",
                "parameters", Map.of("type", "OBJECT", "properties", Map.of())
        ));

        return tools;
    }

    // ── Tool dispatch ────────────────────────────────────────────────────────

    private Object executeTool(String name, JsonNode args) {
        return switch (name) {
            case "get_low_stock_articles" -> getLowStockArticles();
            case "get_article_info" -> getArticleInfo(textArg(args, "codart"), textArg(args, "searchTerm"));
            case "get_supplier_for_article" -> getSupplierForArticle(textArg(args, "codart"));
            case "get_recent_movements" -> getRecentMovements(textArg(args, "codart"), textArg(args, "typeMouvement"), intArg(args, "limit", 10));
            case "get_pending_samples" -> getPendingSamples();
            case "get_stock_summary" -> getStockSummary();
            case "get_active_technicians" -> getActiveTechnicians();
            case "get_recent_receptions" -> getRecentReceptions();
            default -> Map.of("error", "Unknown tool: " + name);
        };
    }

    private String textArg(JsonNode args, String field) {
        if (args == null || !args.hasNonNull(field)) return null;
        String value = args.get(field).asText();
        return value.isBlank() ? null : value;
    }

    private int intArg(JsonNode args, String field, int defaultValue) {
        if (args == null || !args.hasNonNull(field)) return defaultValue;
        return args.get(field).asInt(defaultValue);
    }

    // ── Tool methods (data access) ──────────────────────────────────────────

    private Object getLowStockArticles() {
        return stockRepository.findLowStock().stream().map(this::toArticleMap).toList();
    }

    private Object getArticleInfo(String codart, String searchTerm) {
        List<StockEntity> results = new ArrayList<>();
        if (codart != null) {
            stockRepository.findById(codart).ifPresent(results::add);
        }
        if (results.isEmpty()) {
            String term = searchTerm != null ? searchTerm : codart;
            if (term != null) {
                results = stockRepository.search(term, "", PageRequest.of(0, 10)).getContent();
            }
        }
        if (results.isEmpty()) {
            return Map.of("message", "No matching article found");
        }
        return results.stream().map(this::toArticleMap).toList();
    }

    private Object getSupplierForArticle(String codart) {
        if (codart == null) {
            return Map.of("error", "codart is required");
        }

        List<BonReceptionArticle> receptions = bonReceptionArticleRepository.findByCodartOrderByIdDesc(codart);
        if (receptions.isEmpty()) {
            return Map.of("message", "No reception history found for article " + codart);
        }

        String numBon = receptions.get(0).getNumBon();
        var bonReception = bonReceptionRepository.findByNumBon(numBon);
        if (bonReception.isEmpty()) {
            return Map.of("message", "No supplier information found for article " + codart);
        }

        var fournisseur = fournisseurRepository.findByCode(bonReception.get().getCodFrs());
        if (fournisseur.isEmpty()) {
            return Map.of("message", "No supplier information found for article " + codart);
        }

        Fournisseur f = fournisseur.get();
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("codart", codart);
        m.put("supplierCode", f.getCode());
        m.put("supplierName", f.getRaisonSociale());
        m.put("supplierEmail", f.getEmail());
        m.put("supplierPhone", f.getTelephone());
        return m;
    }

    private Object getRecentMovements(String codart, String typeMouvement, int limit) {
        int size = limit > 0 ? Math.min(limit, 50) : 10;
        String c = codart != null ? codart : "";
        String t = typeMouvement != null ? typeMouvement.toUpperCase() : "";

        List<MouvementStock> movements = mouvementStockRepository.findRecent(c, t, PageRequest.of(0, size));
        if (movements.isEmpty()) {
            return Map.of("message", "No stock movements found");
        }

        return movements.stream().map(mv -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("codart", mv.getCodart());
            m.put("typeMouvement", mv.getTypeMouvement());
            m.put("quantite", mv.getQuantite());
            m.put("numLot", mv.getNumLot());
            m.put("dateMouvement", mv.getDateMouvement());
            m.put("motif", mv.getMotif());
            m.put("utilisateur", mv.getUtilisateur());
            return m;
        }).toList();
    }

    private Object getPendingSamples() {
        List<Echantillon> samples = echantillonRepository.findTop10ByStatusOrderByCollectedAtDesc("Pending");
        if (samples.isEmpty()) {
            return Map.of("message", "No pending samples found", "count", 0);
        }
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("count", samples.size());
        result.put("samples", samples.stream().map(e -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("sampleId", e.getSampleId());
            m.put("patientId", e.getPatientId());
            m.put("type", e.getType());
            m.put("priority", e.getPriority());
            m.put("collectedAt", e.getCollectedAt());
            m.put("status", e.getStatus());
            return m;
        }).toList());
        return result;
    }

    private Object getStockSummary() {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("totalArticles", stockRepository.count());
        m.put("criticalArticles", stockRepository.countCritical());
        m.put("families", stockRepository.findDistinctFamilies());
        return m;
    }

    private Object getActiveTechnicians() {
        List<Technicien> technicians = technicienRepository.findByActifTrue();
        if (technicians.isEmpty()) {
            return Map.of("message", "No active technicians found");
        }
        return technicians.stream().map(t -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("matricule", t.getMatricule());
            m.put("nom", t.getNom());
            m.put("prenom", t.getPrenom());
            m.put("specialite", t.getSpecialite());
            m.put("service", t.getService());
            return m;
        }).toList();
    }

    private Object getRecentReceptions() {
        List<BonReception> receptions = bonReceptionRepository.findTop5ByOrderByDateBonDesc();
        if (receptions.isEmpty()) {
            return Map.of("message", "No reception bons found");
        }
        return receptions.stream().map(b -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("numBon", b.getNumBon());
            m.put("dateBon", b.getDateBon());
            m.put("codFrs", b.getCodFrs());
            m.put("depot", b.getDepot());
            return m;
        }).toList();
    }

    private Map<String, Object> toArticleMap(StockEntity s) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("codart", s.getCodart());
        m.put("desart", s.getDesart());
        m.put("unite", s.getUnimes());
        m.put("stkDep", s.getStkDep());
        m.put("stkMin", s.getStkMin());
        m.put("stkMax", s.getStkMax());
        m.put("famArt", s.getFamArt());
        m.put("critical", s.getStkDep() != null && s.getStkMin() != null && s.getStkDep().compareTo(s.getStkMin()) <= 0);
        return m;
    }
}
