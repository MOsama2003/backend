// export class FirebaseService implements OnModuleInit {
//     private app: admin.app.App;
  
//     constructor(
//       @InjectRepository(Notification)
//       private readonly notificationRepository: Repository<Notification>,
//       private readonly userService: UserService,
//       private readonly configService: ConfigService
//     ) {
//       const credentialsString = this.configService.get<string>('GOOGLE_APPLICATION_CREDENTIALS_JSON');
  
//       if (!credentialsString) {
//         throw new Error('Missing GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable');
//       }
  
//       const credentials = JSON.parse(credentialsString);
  
//       this.app = admin.initializeApp({
//         credential: admin.credential.cert(credentials),
//       });
//     }
//   }
  