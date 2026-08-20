export default function RoleUser({
  role,
}: {
  role: string | null | undefined;
}) {
  return (
    <div className="text-rd flex justify-center text-xs">
      {role?.toLocaleLowerCase()}
    </div>
  );
}
