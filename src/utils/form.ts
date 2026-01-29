export const removeEmptyFields = <T extends Record<string, any>>(obj: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => 
      value !== "" && 
      value !== null && 
      value !== undefined &&
      // Nếu là mảng, lọc bỏ mảng rỗng (tùy chọn)
      !(Array.isArray(value) && value.length === 0)
    )
  ) as Partial<T>;
};