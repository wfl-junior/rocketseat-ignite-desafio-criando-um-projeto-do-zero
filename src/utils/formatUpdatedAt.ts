import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatUpdateAt(date: Date): string {
  return format(date, "dd' 'MMM' 'uuuu", {
    locale: ptBR,
  });
}
