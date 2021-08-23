package domain

import "strings"

type Field string

type SortField string

func (r SortField) GetColumn() Field {
	str := string(r)
	index := strings.Index(str, "|")
	if index == -1 {
		return Field(str)
	}
	return Field(str[:index])
}

func (r SortField) IsAscending() bool {
	str := string(r)
	return strings.Contains(str, "|asc")
}

type Query struct {
	LabelSelector string      `json:"labelSelector,omitempty"`
	Pagination    *Pagination `json:"pagination,omitempty"`
	Columns       []Field     `json:"columns,omitempty"`
	SortBy        []SortField `json:"sortBy,omitempty"`
}

type Pagination struct {
	Limit  int `json:"limit,omitempty"`
	Offset int `json:"offset,omitempty"`
}

var NoPagination = &Pagination{
	Limit:  -1,
	Offset: 0,
}

func (p *Pagination) GetPage(total int) (start, end int) {
	if p.Limit == NoPagination.Limit {
		return 0, total
	}

	// out of range
	if p.Limit < 0 || p.Offset < 0 || p.Offset > total {
		return 0, 0
	}

	start = p.Offset
	end = start + p.Limit

	if end > total {
		end = total
	}

	return start, end
}
