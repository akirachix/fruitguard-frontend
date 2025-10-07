

export interface Device {
    id: number;
    name: string;
    active: boolean;
}


export interface Agrovet {
    id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
    location: string;
    number_of_traps: number;
    devices?: unknown;
    name: string;
    phone: string;
    traps: number;
}

export interface Card {
  count: number;
  label: string;
}


export interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
  }


  
export interface User {
    user_type: string;
  
  }
    