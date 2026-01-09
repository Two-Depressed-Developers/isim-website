import { describe, it, expect } from 'vitest';
import { 
  loginFormSchema, 
  createUsersByEmailSchema, 
  getTicketFormSchema, 
  getConsultationBookingFormSchema,
  consultationAvailabilitySchema
} from './schemas';

const t = (key: string, values?: unknown) => {
  if (values) {
    return `${key} ${JSON.stringify(values)}`;
  }
  return key;
};

describe('loginFormSchema', () => {
  it('should validate correct login data', () => {
    const data = { email: 'test@example.com', password: 'password123' };
    expect(loginFormSchema.safeParse(data).success).toBe(true);
  });

  it('should fail on invalid email', () => {
    const data = { email: 'invalid-email', password: 'password123' };
    const result = loginFormSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should fail on short password', () => {
    const data = { email: 'test@example.com', password: '123' };
    const result = loginFormSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});

describe('createUsersByEmailSchema', () => {
  it('should validate single email', () => {
    expect(createUsersByEmailSchema.safeParse({ emails: 'test@example.com' }).success).toBe(true);
  });

  it('should validate multiple emails separated by commas or newlines', () => {
    const emails = 'test1@example.com, test2@example.com\ntest3@example.com; test4@example.com';
    expect(createUsersByEmailSchema.safeParse({ emails }).success).toBe(true);
  });

  it('should fail if any email is invalid', () => {
    const emails = 'valid@example.com, invalid-email';
    const result = createUsersByEmailSchema.safeParse({ emails });
    expect(result.success).toBe(false);
  });
});

describe('getTicketFormSchema', () => {
  const schema = getTicketFormSchema(t);

  it('should validate correct ticket data with AGH email', () => {
    const data = {
      title: 'Short Title',
      description: 'Long enough description for the ticket.',
      email: 'student@agh.edu.pl'
    };
    expect(schema.safeParse(data).success).toBe(true);
  });

  it('should fail on non-AGH email', () => {
    const data = {
      title: 'Short Title',
      description: 'Long enough description for the ticket.',
      email: 'student@gmail.com'
    };
    const result = schema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
        expect(result.error.issues[0].message).toBe('Validation.aghEmail');
    }
  });

  it('should fail on short title or description', () => {
    const data = {
      title: 'Hi',
      description: 'Too short',
      email: 'student@agh.edu.pl'
    };
    const result = schema.safeParse(data);
    expect(result.success).toBe(false);
  });
});

describe('getConsultationBookingFormSchema', () => {
  const schema = getConsultationBookingFormSchema(t);

  it('should validate correct booking data with AGH email', () => {
    const data = {
      studentEmail: 'student@agh.edu.pl',
      studentName: 'Jan Kowalski',
      fieldAndSubject: 'Computer Science - Math',
      startTime: '2026-01-10T10:00:00Z',
      endTime: '2026-01-10T10:15:00Z',
      memberDocumentId: 'doc_123'
    };
    expect(schema.safeParse(data).success).toBe(true);
  });

  it('should fail on non-AGH email', () => {
    const data = {
      studentEmail: 'student@gmail.com',
      studentName: 'Jan Kowalski',
      fieldAndSubject: 'Math',
      startTime: '2026-01-10T10:00:00Z',
      endTime: '2026-01-10T10:15:00Z',
      memberDocumentId: 'doc_123'
    };
    const result = schema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
        expect(result.error.issues[0].message).toBe('Validation.aghEmail');
    }
  });

  it('should fail on too short student name or missing info', () => {
    const data = {
      studentEmail: 'student@agh.edu.pl',
      studentName: 'Jo',
      fieldAndSubject: '',
      startTime: '',
      endTime: '',
      memberDocumentId: ''
    };
    expect(schema.safeParse(data).success).toBe(false);
  });
});

describe('consultationAvailabilitySchema', () => {
  it('should validate correct availability', () => {
    const data = {
      dayOfWeek: 'monday',
      startTime: '10:00',
      endTime: '11:00',
      durationMinutes: 15,
      isActive: true,
      maxAttendees: 1
    };
    expect(consultationAvailabilitySchema.safeParse(data).success).toBe(true);
  });

  it('should fail if endTime is before or equal to startTime', () => {
    const data = {
      dayOfWeek: 'monday',
      startTime: '11:00',
      endTime: '10:00',
      durationMinutes: 15,
      isActive: true
    };
    const result = consultationAvailabilitySchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Godzina zakończenia musi być późniejsza');
    }
  });

  it('should fail on invalid time format', () => {
    const data = {
      dayOfWeek: 'monday',
      startTime: 'invalid',
      endTime: '10:00',
      durationMinutes: 15,
      isActive: true
    };
    expect(consultationAvailabilitySchema.safeParse(data).success).toBe(false);
  });
});
