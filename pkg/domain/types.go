package domain

type Field string

type Query struct {
	LabelSelector string `json:"labelSelector,omitempty"`

	Pagination *Pagination `json:"pagination,omitempty"`

	Columns map[Field]string `json:"columns,omitempty"`

	SortBy []Field `json:"sortBy,omitempty"`
}

type Pagination struct {
	Limit  int `json:"limit,omitempty"`
	Offset int `json:"offset,omitempty"`
}

var NoPagination = &Pagination{
	Limit:  -1,
	Offset: 0,
}

func NewEmptyQuery() *Query {
	return &Query{
		Pagination: &Pagination{
			Limit:  NoPagination.Limit,
			Offset: NoPagination.Offset,
		},
	}
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
