package com.clinisys.labocore.dto;

import java.util.List;

public record PagedResponse<T>(
        List<T> items,
        int page,
        int size,
        long total
) {
    public PagedResponse {
        items = (items == null) ? List.of() : List.copyOf(items);

        if (page < 1) page = 1;
        if (size < 1) size = 1;
        if (total < 0) total = 0;
    }

    public static <T> PagedResponse<T> of(List<T> items, int page, int size, long total) {
        return new PagedResponse<>(items, page, size, total);
    }
}