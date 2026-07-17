import { PageHeader, Card } from "@/components/ui";
import Reveal from "@/components/Reveal";
import PredictionWidget from "@/components/predicciones/PredictionWidget";
import { predictionRanking } from "@/lib/data";

export const metadata = { title: "Predicciones — Dalia" };

export default function PrediccionesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <PageHeader
        eyebrow="Predicciones"
        title="¿Gana o pierde?"
        lede="Apuesta tus puntos DALIA.EXE al resultado de la próxima ranked de Dalia. Sin dinero real — solo puntos, orgullo y un ranking de videntes."
      />

      <PredictionWidget />

      <Reveal>
        <section className="mt-12 pb-8">
          <h2 className="mb-4 text-xl font-bold">Ranking de videntes</h2>
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-faint">
                  <th className="px-5 py-3 font-semibold">#</th>
                  <th className="px-5 py-3 font-semibold">Usuario</th>
                  <th className="px-5 py-3 text-right font-semibold">Aciertos</th>
                  <th className="px-5 py-3 text-right font-semibold">Precisión</th>
                </tr>
              </thead>
              <tbody>
                {predictionRanking.map((p, i) => {
                  const pct = Math.round((p.aciertos / (p.aciertos + p.fallos)) * 100);
                  return (
                    <tr key={p.user} className="border-b border-line/60 last:border-0 hover:bg-hover">
                      <td className="tnum px-5 py-3 text-dim">{i + 1}</td>
                      <td className="px-5 py-3 font-semibold">{p.user}</td>
                      <td className="tnum px-5 py-3 text-right text-dim">
                        {p.aciertos} / {p.aciertos + p.fallos}
                      </td>
                      <td className={`tnum px-5 py-3 text-right font-bold ${pct >= 65 ? "text-gold" : ""}`}>
                        {pct}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </section>
      </Reveal>
    </div>
  );
}
