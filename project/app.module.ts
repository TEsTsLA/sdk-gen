import { Module } from "@nestjs/common";
import { DemoController } from "./demo.controller";
import { UserController } from "./user.controller";

@Module({
  controllers: [DemoController,UserController],
})
export class AppModule {}
