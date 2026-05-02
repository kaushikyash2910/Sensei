import { ConverterForm } from "./_components/converter-form";
export default function CodeConverterPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Code Language Converter</h1>
      <p className="text-muted-foreground mb-8">
        Paste code in any language and convert it to another — with a
        side-by-side editor view and syntax difference highlights.
      </p>
      <ConverterForm />
    </div>
  );
}