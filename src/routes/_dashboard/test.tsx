import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/test")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const onUpdateParamsTest = () => {
    navigate({ to: ".", search: (prev) => ({ ...prev, filter: "Test" }) });
  };

  const onInputParamsChange = (value: string) => {
    navigate({ to: ".", search: (prev) => ({ ...prev, filter: value }) });
  };

  return (
    <div className="p-2">
      <input onChange={(e) => onInputParamsChange(e.target.value)} />
      <button onClick={onUpdateParamsTest}>Update Params</button>
      <h3>Params Test</h3>
    </div>
  );
}
