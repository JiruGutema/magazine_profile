import { CardHeader, CardTitle, CardContent, Card } from "../ui/card";

export default function Languages() {
  return (
    <section>
      <div>
        <h2 className="text-3xl font-medium font-serif  mb-4">
          Languages
        </h2>
      </div>
      <div>
        <ul className="list-disc list-inside text-base mt-2">
          <li>
            <strong className="text-base font-medium">English:</strong> Fluent
          </li>
          <li>
            <strong className="text-base font-medium">Afaan Oromoo:</strong> Native
          </li>
          <li>
            <strong className="text-base font-medium">Amharic:</strong> Fluent
          </li>
        </ul>
      </div>
    </section>
  );
}
