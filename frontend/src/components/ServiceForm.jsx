import { useState } from "react";
import { createService } from "../api";

export default function ServiceForm({ onCreated }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    state: "active",
    "@type": "Service",
    serviceSpecification: {
      id: "spec-001",
      name: "Default Spec",
      version: "1.0",
      "@type": "ServiceSpecificationRef",
      "@referredType": "ServiceSpecification"
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newService = await createService(form);
    onCreated(newService);
    setForm({ ...form, name: "", description: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-bold mb-2">Add New Service</h3>
      <input
        className="w-full mb-2 p-2 border rounded"
        placeholder="Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
      <textarea
        className="w-full mb-2 p-2 border rounded"
        placeholder="Description"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
        Create Service
      </button>
    </form>
  );
}
