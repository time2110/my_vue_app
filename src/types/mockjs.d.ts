// src/types/mockjs.d.ts
declare module "mockjs" {
  const Mock: {
    mock(template: any): any
    Random: {
      string(length?: number): string
      integer(min?: number, max?: number): number
      float(min?: number, max?: number, dmin?: number, dmax?: number): number
      boolean(): boolean
      date(format?: string): string
      time(format?: string): string
      datetime(format?: string): string
      now(unit?: string, format?: string): string
      image(
        size?: string,
        background?: string,
        foreground?: string,
        format?: string,
        text?: string
      ): string
      color(): string
      paragraph(min?: number, max?: number): string
      // 更多方法可按需添加...
    }
    setup(settings: { timeout?: string | number }): void
    // 其他 Mock 方法...
  }

  export = Mock
}
