import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

const defaultTree = {
  id: "root",
  label: "Appel client",
  children: [],
};

function TreeNode({ node, onAdd, onEdit, onDelete }) {
  return (
    <div className="ml-4 mt-2">
      <Card className="p-2">
        <CardContent>
          <input
            type="text"
            value={node.label}
            onChange={(e) => onEdit(node.id, e.target.value)}
            className="mb-2 w-full border p-1 rounded"
          />
          <div className="flex gap-2">
            <Button onClick={() => onAdd(node.id)}>Ajouter</Button>
            {node.id !== "root" && (
              <Button variant="destructive" onClick={() => onDelete(node.id)}>
                Supprimer
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      <div className="ml-4">
        {node.children.map((child) => (
          <TreeNode
            key={child.id}
            node={child}
            onAdd={onAdd}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default function ArbreDecision() {
  const [tree, setTree] = useState(defaultTree);

  const handleAdd = (parentId) => {
    const newNode = { id: generateId(), label: "", children: [] };
    const updateTree = (node) => {
      if (node.id === parentId) {
        return { ...node, children: [...node.children, newNode] };
      }
      return { ...node, children: node.children.map(updateTree) };
    };
    setTree(updateTree(tree));
  };

  const handleEdit = (id, newLabel) => {
    const updateTree = (node) => {
      if (node.id === id) {
        return { ...node, label: newLabel };
      }
      return { ...node, children: node.children.map(updateTree) };
    };
    setTree(updateTree(tree));
  };

  const handleDelete = (id) => {
    const deleteNode = (node) => {
      return {
        ...node,
        children: node.children
          .filter((child) => child.id !== id)
          .map(deleteNode),
      };
    };
    setTree(deleteNode(tree));
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tree, null, 2));
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "arbre_secretaire_acad.json");
    dlAnchorElem.click();
  };

  const handleImport = (e) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const importedTree = JSON.parse(event.target.result);
      setTree(importedTree);
    };
    fileReader.readAsText(e.target.files[0]);
  };

  const handleReset = () => {
    if (confirm("Voulez-vous vraiment réinitialiser l'arbre ?")) {
      setTree(defaultTree);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Secrétariat ACAD - Arbre Décisionnel</h1>
      <div className="flex gap-4 mb-4">
        <Button onClick={handleExport}>Exporter JSON</Button>
        <input type="file" accept="application/JSON" onChange={handleImport} />
        <Button variant="destructive" onClick={handleReset}>Réinitialiser</Button>
      </div>
      <TreeNode node={tree} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
