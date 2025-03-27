export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Register {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface Login {
  email: string;
  password: string;
}

export interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  total_bookings: number;
  available_slots: number;
};

export interface ViewEvent {
  booking: any
}

export interface EventInputs {
  name: string;
  location: string;
  date: string;
  time: string;
  capacity: number | null;
  description: string;
};

export type PageProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
  auth: {
    user: User;
    isAdmin: boolean;
  };
};