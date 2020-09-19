import { Body, Controller, Get, Post } from "@nestjs/common";

@Controller()
export class DemoController {
  @Get()
  async getDemo(): Promise<string> {
    return `hello world`;
  }

  @Post()
  async postDemo(@Body("demo") demo: string): Promise<string> {
    return `hello world`;
  }
}
