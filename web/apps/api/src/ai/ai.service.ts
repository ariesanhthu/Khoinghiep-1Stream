import { Injectable } from '@nestjs/common'
import type { AiSuggestRequest, AiSuggestResponse } from '@sea/contracts'

@Injectable()
export class AiService {
  private readonly aiServiceUrl = process.env.AI_SERVICE_URL ?? 'http://localhost:8000'

  async suggest(req: AiSuggestRequest): Promise<AiSuggestResponse> {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000)
      const response = await fetch(`${this.aiServiceUrl}/suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
        signal: controller.signal,
      })
      clearTimeout(timeout)
      return (await response.json()) as AiSuggestResponse
    } catch {
      return { suggestion: '[AI service unavailable]' }
    }
  }
}
