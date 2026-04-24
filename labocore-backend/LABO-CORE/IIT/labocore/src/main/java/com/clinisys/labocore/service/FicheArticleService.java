package com.clinisys.labocore.service;

import com.clinisys.labocore.dto.ArticleDetailsDto;
import com.clinisys.labocore.dto.ArticleSaveRequest;
import com.clinisys.labocore.dto.PagedResponse;

public interface FicheArticleService {
    PagedResponse<ArticleDetailsDto> listArticles(int page, int size, String code, String designation);
    ArticleDetailsDto getArticleDetails(String codeArticle);
    ArticleDetailsDto createArticle(ArticleSaveRequest request);
    ArticleDetailsDto updateArticle(String codeArticle, ArticleSaveRequest request);
    void deleteArticle(String codeArticle);
}