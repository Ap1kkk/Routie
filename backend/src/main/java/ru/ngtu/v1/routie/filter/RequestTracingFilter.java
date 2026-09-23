package ru.ngtu.v1.routie.filter;

import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.context.Scope;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Фильтр трейсинга запросов. Генерирует requestId, сохраняет в атрибут запроса и устанавливает
 * заголовок X-Request-Id в каждом ответе.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@RequiredArgsConstructor
public class RequestTracingFilter extends OncePerRequestFilter {

  public static final String HEADER_REQUEST_ID = "X-Trace-Id";

  private final Tracer tracer;

  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain
  ) throws ServletException, IOException {
    Span span = tracer.spanBuilder(request.getMethod() + " " + request.getRequestURI()).startSpan();

    try (Scope scope = span.makeCurrent()) {
      String traceId = span.getSpanContext().getTraceId();
      response.setHeader(HEADER_REQUEST_ID, traceId);
      filterChain.doFilter(request, response);
    } finally {
      span.end();
    }

  }
}
