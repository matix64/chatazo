import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomsModule } from '../rooms/rooms.module';
import { InvitesController } from './invites.controller';
import { InvitesService } from './invites.service';
import { Invite, InviteSchema } from './models/invite.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invite.name, schema: InviteSchema }]),
    RoomsModule,
  ],
  controllers: [InvitesController],
  providers: [InvitesService],
})
export class InvitesModule {}
