import { useState, useEffect, DragEvent, ChangeEvent } from "react";
import CrmSidebar from "@/components/crm/CrmSidebar";
import MobileHeader from "@/components/crm/MobileHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  FileText,
  UploadCloud,
  FileEdit,
  Plus,
  Download,
  Trash2,
  FileImage,
  FileSpreadsheet,
  File as FileIcon,
  Search,
  Loader2,
} from "lucide-react";

import { useDocumento } from "@/hooks/useDocumento";
import { useToast } from "@/hooks/use-toast";

const getFileName = (url: string) => {
  if (!url) return "Documento Desconhecido";
  return url.split("/").pop() || "Documento";
};

const getFileType = (url: string) => {
  if (!url) return "file";
  const parts = url.split(".");
  return parts.length > 1 ? parts.pop()?.toLowerCase() || "file" : "file";
};

const fileIcon = (type: string) => {
  switch (type) {
    case "pdf": return <FileText className="w-5 h-5 text-red-400" />;
    case "docx":
    case "doc": return <FileEdit className="w-5 h-5 text-blue-400" />;
    case "image":
    case "png":
    case "jpg":
    case "jpeg": return <FileImage className="w-5 h-5 text-emerald-400" />;
    case "xlsx":
    case "xls": return <FileSpreadsheet className="w-5 h-5 text-green-400" />;
    default: return <FileIcon className="w-5 h-5 text-muted-foreground" />;
  }
};

const typeBadge = (type: string) => {
  const map: Record<string, string> = { pdf: "PDF", docx: "DOCX", png: "PNG", jpg: "JPG", xlsx: "XLSX" };
  return map[type] || type.toUpperCase();
};

const Documents = () => {
  const currentUserId = 1;

  const {
    documentos: documents,
    isLoading: isLoadingDocs,
    fetchAllDocumento: fetchDocs,
    uploadDocumento,
    deleteDocumento: deleteDoc
  } = useDocumento();

  const [searchDoc, setSearchDoc] = useState("");
  const { toast } = useToast();
  const [showNewDoc, setShowNewDoc] = useState(false);
  const [docName, setDocName] = useState("");
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  const handleDeleteDoc = async (id: number) => {
    try {
      await deleteDoc(id);
      toast({ title: "Sucesso", description: "Documento excluído com sucesso", variant: "success" });

      fetchDocs()
    } catch (error) {
      toast({ title: "Erro", description: "Erro ao excluir documento", variant: "destructive" });

    }
  };

  const handleDownloadDoc = (url: string, name: string) => {
    window.open(url, '_blank');
    toast({ title: "Download", description: "Iniciando download do documento" });
  };

  const handleUploadFileDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) await processDocumentUpload(file);
  };

  const handleUploadFileInput = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processDocumentUpload(file);
  };

  const processDocumentUpload = async (file: File) => {
    try {
      const finalName = docName.trim() ? docName : file.name;
      await uploadDocumento(file, currentUserId, finalName);
      toast({ title: "Sucesso", description: "Arquivo enviado com sucesso", variant: "success" });
      resetModal();
      fetchDocs()
      console.log(documents)
    } catch (error) {
      toast({ title: "Erro", description: "Erro ao enviar arquivo", variant: "destructive" });
    }
  };

  const resetModal = () => {
    setShowNewDoc(false);
    setDocName("");
  };

  const filteredDocs = documents.filter((d) =>
    (d.name || "").toLowerCase().includes(searchDoc.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <CrmSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader />
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Gestão de Documentos</h1>
            <p className="text-sm text-muted-foreground mt-1">Gerencie seus arquivos de forma centralizada.</p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar documento..."
                  value={searchDoc}
                  onChange={(e) => setSearchDoc(e.target.value)}
                  className="pl-9 bg-card border-border"
                />
              </div>
              <Button onClick={() => setShowNewDoc(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                <Plus className="w-4 h-4" />
                Novo Documento
              </Button>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Arquivo</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Tipo</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Criado em</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingDocs ? (
                      <tr>
                        <td colSpan={4} className="text-center py-12 text-muted-foreground">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                          Carregando documentos...
                        </td>
                      </tr>
                    ) : filteredDocs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-12 text-muted-foreground">
                          Nenhum documento encontrado.
                        </td>
                      </tr>
                    ) : (
                      filteredDocs.map((doc) => {
                        const fileName = doc.name || getFileName(doc.url);
                        const fileType = getFileType(doc.url);
                        return (
                          <tr key={doc.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {fileIcon(fileType)}
                                <span className="font-medium text-foreground truncate max-w-[200px] sm:max-w-none" title={fileName}>
                                  {fileName}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell">
                              <Badge variant="secondary" className="text-xs">{typeBadge(fileType)}</Badge>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                              {new Date(doc.createdAt).toLocaleDateString("pt-BR")}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon" onClick={() => handleDownloadDoc(doc.url, fileName)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteDoc(doc.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showNewDoc} onOpenChange={(open) => { if (!open) resetModal(); }}>
        <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Upload de Arquivo</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Nome do Documento (Opcional)</Label>
              <Input
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="Se vazio, usará o nome do arquivo"
                className="text-sm"
              />
            </div>

            <div className="relative">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleUploadFileInput}
                accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
              />
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleUploadFileDrop}
                className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors relative ${dragOver ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/40"
                  }`}
              >
                <UploadCloud className={`w-10 h-10 mx-auto mb-3 ${dragOver ? "text-primary" : "text-muted-foreground"}`} />
                <p className="text-sm font-medium text-foreground">Arraste e solte seu arquivo aqui</p>
                <p className="text-xs text-muted-foreground mt-1">ou clique para selecionar · PDF, DOCX, PNG, JPG</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Documents;