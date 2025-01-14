package mocks

type MockWriter struct {
    Output *string
}

func (w *MockWriter) Write(p []byte) (n int, err error) {
    *w.Output += string(p)
    return len(p), nil
}
