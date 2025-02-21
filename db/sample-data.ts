import { Role, Prisma } from '@prisma/client';

export const sa = 
{
   users: [
    {
      name: "John Doe",
      email: "john.doe@example.com",
      emailVerified: new Date(),
      image: null,
      hashedPassword: "password",
      createdAt: new Date(),
      privacyPolicyAccepted: true,
      role: Role.ADMINISTRATOR,
      termsAccepted: true,
      archived: false,
      recoveryToken: null,
      preferences: Prisma.JsonNull,
      lastLogin: null,
   },
   {
     
      name: "Doe",
      email: "doe@example.com",
      emailVerified: new Date(),
      image: null,
      hashedPassword: "password",
      createdAt: new Date(),
      privacyPolicyAccepted: true,
      role: Role.USER,
      termsAccepted: true,
      archived: false,
      recoveryToken: null,
      preferences: Prisma.JsonNull,
      lastLogin: null,
   },
   {
    
      name: "S Doe",
      email: "s.doe@example.com",
      emailVerified: new Date(),
      image: null,  
      hashedPassword: "password",
      createdAt: new Date(),
      privacyPolicyAccepted: true,
      role: Role.SUPERVISOR,
      termsAccepted: true,
      archived: false,
      recoveryToken: null,
      preferences: Prisma.JsonNull,
      lastLogin: null,
   }
  ],
  organizations: [
    
    
  ]
}
