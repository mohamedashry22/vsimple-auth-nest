import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import xss from 'xss';

type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
interface JSONObject { [key: string]: JSONValue }
type JSONArray = JSONValue[];

function sanitizeRecursive(input: JSONValue): JSONValue {
  if (typeof input === 'string') return xss(input);
  if (Array.isArray(input)) return input.map(sanitizeRecursive) as JSONArray;
  if (input !== null && typeof input === 'object') {
    const out: JSONObject = {};
    for (const [k, v] of Object.entries(input)) {
      out[k] = sanitizeRecursive(v);
    }
    return out;
  }
  return input;
}

@Injectable()
export class SanitizeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const req = http.getRequest<{ body: JSONValue; query: JSONValue; params: JSONValue }>();
    req.body = sanitizeRecursive(req.body);
    req.query = sanitizeRecursive(req.query);
    req.params = sanitizeRecursive(req.params);
    return next.handle();
  }
}