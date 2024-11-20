// src/app/address.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Address } from './interfaces/address';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private apiUrl = `${environment.api_url}/addresses`;  // Adjust the URL based on your backend

  constructor(private http: HttpClient) { }

  // Get all addresses
  getAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(this.apiUrl);
  }

  // Get address by ID
  getAddress(id: string): Observable<Address> {
    return this.http.get<Address>(`${this.apiUrl}/${id}`);
  }

  // Create a new address
  createAddress(address: Address): Observable<Address> {
    return this.http.post<Address>(this.apiUrl, address);
  }

  // Update an existing address
  updateAddress(id: string, address: Address): Observable<Address> {
    return this.http.put<Address>(`${this.apiUrl}/${id}`, address);
  }

  // Delete an address
  deleteAddress(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
