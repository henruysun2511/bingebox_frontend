export const formatDate = (dateStr: string) =>
    new Intl.DateTimeFormat('vi-VN').format(new Date(dateStr));