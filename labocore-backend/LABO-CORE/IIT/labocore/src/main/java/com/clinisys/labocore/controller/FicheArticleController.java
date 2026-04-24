package com.clinisys.labocore.controller;

import com.clinisys.labocore.dto.ArticleDetailsDto;
import com.clinisys.labocore.dto.ArticleSaveRequest;
import com.clinisys.labocore.dto.PagedResponse;
import com.clinisys.labocore.service.FicheArticleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/articles")
public class FicheArticleController {

    private final FicheArticleService service;

    public FicheArticleController(FicheArticleService service) {
        this.service = service;
    }

    /** GET /api/articles?page=1&size=20&code=&designation= */
    @GetMapping
    public ResponseEntity<PagedResponse<ArticleDetailsDto>> list(
            @RequestParam(defaultValue = "1")  int    page,
            @RequestParam(defaultValue = "20") int    size,
            @RequestParam(defaultValue = "")   String code,
            @RequestParam(defaultValue = "")   String designation
    ) {
        return ResponseEntity.ok(service.listArticles(page, size, code, designation));
    }

    /** GET /api/articles/{codeArticle} */
    @GetMapping("/{codeArticle}")
    public ResponseEntity<ArticleDetailsDto> getOne(@PathVariable String codeArticle) {
        return ResponseEntity.ok(service.getArticleDetails(codeArticle));
    }

    /** POST /api/articles */
    @PostMapping
    public ResponseEntity<ArticleDetailsDto> create(
            @Valid @RequestBody ArticleSaveRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createArticle(request));
    }

    /** PUT /api/articles/{codeArticle} */
    @PutMapping("/{codeArticle}")
    public ResponseEntity<ArticleDetailsDto> update(
            @PathVariable String codeArticle,
            @Valid @RequestBody ArticleSaveRequest request) {
        return ResponseEntity.ok(service.updateArticle(codeArticle, request));
    }

    /** DELETE /api/articles/{codeArticle} */
    @DeleteMapping("/{codeArticle}")
    public ResponseEntity<Void> delete(@PathVariable String codeArticle) {
        service.deleteArticle(codeArticle);
        return ResponseEntity.noContent().build();
    }
}



   /*     ## How to Run in IntelliJ

1. Open the project — Maven auto-imports all dependencies
2. Open `application.yml` — replace the 5 placeholders with your SQL Server values
3. Ensure SQL Server is reachable and the database exists with the expected tables
4. Set `ddl-auto: validate` to verify your schema matches the entities on startup
5. Click ▶ on `LabocoreApplication` or run `mvn spring-boot:run`
        6. API is live at `http://localhost:8080`

        ---

        ## Postman Test Guide

### Create article — POST
```
POST http://localhost:8080/api/articles
Content-Type: application/json*/