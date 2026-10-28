export default function EmployeeDataCard({
  icon: Icon,
  textCard,
  value,
}: {
  icon: React.ElementType;
  textCard: string;
  value: string;
}) {
  return (
    <div className="group border-border/60 bg-muted/20 hover:border-primary/20 hover:bg-muted/50 grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border p-4 transition-colors duration-200 hover:text-blue-600">
      <div className="text-muted-foreground flex items-center gap-4">
        <div className="bg-background flex size-8 items-center justify-center rounded-lg shadow-sm">
          <Icon className="text-primary size-4 group-hover:text-blue-600" />
        </div>
        <span className="text-sm">{textCard}</span>
      </div>

      <div className="text-md pr-4 font-semibold tracking-tight wrap-break-word">
        {value}
      </div>
    </div>
  );
}
