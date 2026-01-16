"use client";

import { useAuthQuery } from "@/queries/useAuthQuery";


export function AuthInit() {
  useAuthQuery();
  return null;
}