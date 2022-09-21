import { Module } from '@nestjs/common';
import { DiscordBotService } from '../shared/services/discord-bot.service';
import { IPFSClientService } from '../shared/services/ipfs.service';

@Module({
  providers: [IPFSClientService, DiscordBotService],
  exports: [IPFSClientService, DiscordBotService]
})
export class ApiServicesModule { }
