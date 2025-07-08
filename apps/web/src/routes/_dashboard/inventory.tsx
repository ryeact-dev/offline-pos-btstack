import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/inventory')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dashboard/inventory"!</div>
}
