package types

import (
	"errors"
	"fmt"
	"reflect"
	"strings"
	"time"

	"github.com/ahmetb/go-linq/v3"
)

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

type ListQuery struct {
	Keywords string      `json:"keywords,omitempty"`
	SortBy   []SortField `json:"sortBy,omitempty"`
	Limit    int         `json:"limit,omitempty" default:"10"`
	Offset   int         `json:"offset,omitempty" default:"0"`
}

type QueryExecutor struct {
	predicate func(interface{}) bool
	source    interface{}
	limit     int
	offset    int
	sortBy    []SortField
}

func (q *ListQuery) CreateExecutor(source interface{}) *QueryExecutor {
	return CreateQueryExecutor(source).
		Sorts(q.SortBy).
		Page(q.Offset, q.Limit)
}

func (q *ListQuery) CreateFilterExecutor(source interface{}, predicate func(keywords string, i interface{}) bool) *QueryExecutor {
	return q.CreateExecutor(source).
		Filter(func(i interface{}) bool {
			return predicate(q.Keywords, i)
		})
}

func CreateQueryExecutor(source interface{}) *QueryExecutor {
	return &QueryExecutor{
		source: source,
	}
}

func (q *QueryExecutor) Page(offset, limit int) *QueryExecutor {
	q.offset = offset
	q.limit = limit
	return q
}

func (q *QueryExecutor) Filter(predicate func(interface{}) bool) *QueryExecutor {
	q.predicate = predicate
	return q
}

func (q *QueryExecutor) Sorts(sorts []SortField) *QueryExecutor {
	q.sortBy = sorts
	return q
}

func (q *QueryExecutor) Exec(v interface{}) (total int, err error) {
	if q.limit <= 0 {
		return 0, nil
	}

	query := linq.From(q.source)

	if q.predicate != nil {
		query = query.Where(q.predicate)
	}

	// total is zero, return
	total = query.Count()
	if total <= 0 {
		return 0, nil
	}

	if q.offset > 0 {
		query = query.Skip(q.offset)
	}
	query = query.Take(q.limit)

	// page is zero, return
	if query.Count() <= 0 {
		return total, nil
	}

	// no sort
	if len(q.sortBy) <= 0 {
		query.ToSlice(v)
		return total, nil
	}

	var oq linq.OrderedQuery
	for i, item := range q.sortBy {
		field := item.GetColumn()
		isAscending := item.IsAscending()

		selector := func(i interface{}) interface{} {
			sv, e := selectOrderValue(string(field), i)
			// select error, return 0
			if e != nil {
				err = e
				return 0
			}
			return sv
		}

		// first use OrderBy... else TheBy...
		if i == 0 {
			if isAscending {
				oq = query.OrderBy(selector)
			} else {
				oq = query.OrderByDescending(selector)
			}
		} else {
			if isAscending {
				oq = oq.ThenBy(selector)
			} else {
				oq = oq.ThenByDescending(selector)
			}
		}
	}
	oq.ToSlice(v)
	return total, err
}

func selectValue(name string, instance interface{}, convert func(interface{}) interface{}) (interface{}, error) {
	v := reflect.ValueOf(instance)
	if v.Kind() == reflect.Ptr {
		v = v.Elem()
	}

	f := v.FieldByNameFunc(func(fn string) bool {
		return strings.EqualFold(fn, name)
	})

	if f.IsValid() {
		return convert(f.Interface()), nil
	}

	return nil, errors.New(fmt.Sprintf("find field error: '%s'", name))
}

func selectOrderValue(name string, instance interface{}) (interface{}, error) {
	return selectValue(name, instance, func(v interface{}) interface{} {
		switch fv := v.(type) {
		case time.Time:
			return fv.Unix()
		default:
			return fv
		}
	})
}
