/**
 * Cloud vs on-prem, row by row. Reused on the homepage and /security.
 */

const rows = [
  {
    label: "Where it runs",
    cloud: "A Vertex-hosted tenant.",
    onprem: "One container on a machine you own, behind your firewall.",
  },
  {
    label: "What leaves your network",
    cloud: "Your drawings, to the tenant. Nothing else.",
    onprem: "Nothing, for native CAD archives.",
  },
  {
    label: "Reading PDFs and scans",
    cloud: "Hosted readers, or your own keys.",
    onprem: "The local model, or your own keys to a zero-retention endpoint you choose.",
  },
  {
    label: "Updates",
    cloud: "Continuous.",
    onprem: "You pull a new container when you decide to.",
  },
  {
    label: "Who can see your archive",
    cloud: "You, and the people you name.",
    onprem: "You, and the people you name. Vertex can't.",
  },
];

export function DeploySplit() {
  return (
    <div className="border-y border-vx-400">
      <div className="hidden grid-cols-12 gap-6 border-b border-vx-400 py-4 lg:grid">
        <div className="col-span-4" />
        <div className="col-span-4 text-h3 text-vx-900">Cloud</div>
        <div className="col-span-4 text-h3 text-vx-900">On-prem</div>
      </div>
      <dl className="divide-y divide-vx-400">
        {rows.map((r) => (
          <div key={r.label} className="grid gap-3 py-5 lg:grid-cols-12 lg:gap-6">
            <dt className="text-small text-vx-600 lg:col-span-4">{r.label}</dt>
            <dd className="text-body text-vx-900 lg:col-span-4">
              <span className="mr-3 text-small text-vx-600 lg:hidden">Cloud</span>
              {r.cloud}
            </dd>
            <dd className="text-body text-vx-900 lg:col-span-4">
              <span className="mr-3 text-small text-vx-600 lg:hidden">On-prem</span>
              {r.onprem}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
