import { ClassResponseDto, SpecificClassResponseDto } from "@/types";

export const mapToClassResponse = (
  id: string,
  name: string,
  childrenNumber: number,
  nanniesNames: string[]
): ClassResponseDto => ({
  id,
  name,
  childrenNumber,
  nanniesNames,
});

export const mapToSpecificClassResponse = (
  id: string,
  name: string,
  children: any[],
  nanniesNames: string[]
): SpecificClassResponseDto => ({
  id,
  name,
  children,
  nanniesNames,
});