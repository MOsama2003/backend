import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { FirebaseService } from './firebase.service';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Get()
  findAll(@Req() req: any) {
    return this.notificationsService.getAllNotification(req)
  }
}
