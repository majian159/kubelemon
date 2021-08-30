package util

import (
	"encoding/json"
	"fmt"
	"strings"
)

func EscapeJsonPatch(v string) string {
	if strings.Contains(v, "~") {
		v = strings.ReplaceAll(v, "~", "~0")
	}
	if strings.Contains(v, "/") {
		v = strings.ReplaceAll(v, "/", "~1")
	}
	return v
}

func CreateReplacePatch(path string, value interface{}) []byte {
	data, _ := json.Marshal(value)
	v := string(data)
	return []byte(fmt.Sprintf(`[{"op":"replace","path":"%s","value":%s}]`, path, v))
}
