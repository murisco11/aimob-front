import { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, ArrowUpCircle, ArrowDownCircle, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import CrmSidebar from "@/components/crm/CrmSidebar";
import MobileHeader from "@/components/crm/MobileHeader";
import { toast } from "@/components/ui/sonner";

import { useTransaction } from "@/hooks/useTransaction";
import { useTransactionType } from "@/hooks/useTransactionType";

import { Transaction } from "@/types/TransactionType"
import { TransactionType } from "@/types/TransactionTypeType"
import { useConfirmStore } from "@/stores/confirmStore";

const Transactions = () => {
  const {
    transactions,
    fetchAllTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransaction();

  const {
    transactionTypes: types,
    fetchAllTransactionTypeS,
    createTransactionType,
    updateTransactionType,
    deleteTransactionType,
  } = useTransactionType();

  useEffect(() => {
    fetchAllTransactions();
    fetchAllTransactionTypeS();
  }, [fetchAllTransactions, fetchAllTransactionTypeS]);

  const [search, setSearch] = useState("");
  const { openConfirm } = useConfirmStore();
  const [filterType, setFilterType] = useState<string>("all");
  const [filterProfit, setFilterProfit] = useState<string>("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [formName, setFormName] = useState("");
  const [formValor, setFormValor] = useState("");
  const [formIsProfit, setFormIsProfit] = useState(false);
  const [formTypeId, setFormTypeId] = useState<string>("");

  const [typeDialogOpen, setTypeDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<TransactionType | null>(null);
  const [formTypeName, setFormTypeName] = useState("");

  const resetTransactionForm = () => {
    setFormName("");
    setFormValor("");
    setFormIsProfit(true);
    setFormTypeId("");
    setEditingTransaction(null);
  };

  const openNewTransaction = () => {
    resetTransactionForm();
    setDialogOpen(true);
  };

  const openEditTransaction = (t: Transaction) => {
    setEditingTransaction(t);
    setFormName(t.name);
    setFormValor(t.valor.toString());
    setFormIsProfit(t.isProfit);
    setFormTypeId(t.transactionType?.id?.toString() || "");
    setDialogOpen(true);
  };

  const handleSaveTransaction = async () => {
    if (!formName.trim() || !formValor.trim()) {
      toast.error("Preencha o nome e o valor.");
      return;
    }
    const valor = parseFloat(formValor);
    if (isNaN(valor) || valor <= 0) {
      toast.error("Informe um valor válido.");
      return;
    }

    const payload = {
      name: formName.trim(),
      valor,
      isProfit: formIsProfit,
      transactionType: formTypeId ? types.find(t => t.id == Number(formTypeId)) : undefined,
    };

    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, payload);
        toast.success("Transação atualizada!");
      } else {
        await createTransaction(payload);
        toast.success("Transação criada!");
      }
      setDialogOpen(false);
      resetTransactionForm();
    } catch (error) {
      toast.error("Erro ao salvar a transação.");
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    try {
      await openConfirm({
        title: "Excluir Transação",
        description: `Tem certeza que deseja excluir permanentemente a transação? Esta ação não pode ser desfeita.`,
        confirmText: "Sim, Excluir",
        onConfirm: async () => {
          await deleteTransaction(id);
          toast.success("Transação excluída com sucesso!");
        }
      });
    } catch (error) {
      toast.error("Erro ao excluir a transação.");
    }
  };

  const openNewType = () => {
    setEditingType(null);
    setFormTypeName("");
    setTypeDialogOpen(true);
  };

  const openEditType = (t: TransactionType) => {
    setEditingType(t);
    setFormTypeName(t.name);
    setTypeDialogOpen(true);
  };

  const handleSaveType = async () => {
    if (!formTypeName.trim()) {
      toast.error("Informe o nome do tipo.");
      return;
    }

    const payload = {
      name: formTypeName.trim(),
    };

    try {
      if (editingType) {
        await updateTransactionType(editingType.id, { name: payload.name, id: editingType.id });
        toast.success("Categoria atualizada!");
      } else {
        await createTransactionType(payload);
        toast.success("Categoria criada!");
      }
      setTypeDialogOpen(false);
    } catch (error) {
      toast.error("Erro ao salvar a categoria.");
    }
  };

  const handleDeleteType = async (id: number) => {
    try {
      await openConfirm({
        title: "Excluir Categoria",
        description: `Tem certeza que deseja excluir permanentemente a categorias? Esta ação não pode ser desfeita.`,
        confirmText: "Sim, Excluir",
        onConfirm: async () => {
          await deleteTransactionType(id);
          toast.success("Categoria excluída com sucesso!");
        }
      });
    } catch (error) {
      toast.error("Erro ao excluir a categoria.");
    }
  };

  const safeTransactions = transactions || [];
  const safeTypes = types || [];

  const filtered = safeTransactions.filter((t) => {
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType !== "all" && t.transactionType?.id?.toString() !== filterType) return false;
    if (filterProfit === "profit" && !t.isProfit) return false;
    if (filterProfit === "expense" && t.isProfit) return false;
    return true;
  });

  const totalProfit = filtered.filter((t) => t.isProfit).reduce((s, t) => s + Number(t.valor), 0);
  const totalExpense = filtered.filter((t) => !t.isProfit).reduce((s, t) => s + Number(t.valor), 0);
  const balance = totalProfit - totalExpense;

  const formatCurrency = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="flex h-screen bg-background text-foreground">
      <CrmSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileHeader />

        <div className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-foreground">Transações</h1>
              <p className="text-sm text-muted-foreground">Gerencie receitas e despesas</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={openNewType}>
                <Plus className="w-4 h-4 mr-1" /> Tipo
              </Button>
              <Button size="sm" onClick={openNewTransaction}>
                <Plus className="w-4 h-4 mr-1" /> Nova Transação
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <ArrowUpCircle className="w-4 h-4 text-success" /> Receitas
              </div>
              <p className="text-lg font-bold text-success">{formatCurrency(totalProfit)}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <ArrowDownCircle className="w-4 h-4 text-destructive" /> Despesas
              </div>
              <p className="text-lg font-bold text-destructive">{formatCurrency(totalExpense)}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Filter className="w-4 h-4" /> Saldo
              </div>
              <p className={`text-lg font-bold ${balance >= 0 ? "text-primary" : "text-destructive"}`}>
                {formatCurrency(balance)}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar transação..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterProfit} onValueChange={setFilterProfit}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="profit">Receitas</SelectItem>
                <SelectItem value="expense">Despesas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                {safeTypes.map((t) => (
                  <SelectItem key={t.id} value={t.id.toString()}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Nome</TableHead>
                  <TableHead className="text-muted-foreground">Tipo</TableHead>
                  <TableHead className="text-muted-foreground">Categoria</TableHead>
                  <TableHead className="text-muted-foreground text-right">Valor</TableHead>
                  <TableHead className="text-muted-foreground">Data</TableHead>
                  <TableHead className="text-muted-foreground text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      Nenhuma transação encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((t) => (
                    <TableRow key={t.id} className="border-border">
                      <TableCell className="font-medium text-foreground">{t.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={t.isProfit ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {t.isProfit ? "Receita" : "Despesa"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {t.transactionType?.name || "—"}
                      </TableCell>
                      <TableCell
                        className={`text-right font-semibold ${t.isProfit ? "text-primary" : "text-destructive"}`}
                      >
                        {t.isProfit ? "+" : "-"} {formatCurrency(Number(t.valor))}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {t.createdAt ? new Date(t.createdAt).toLocaleDateString("pt-BR") : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditTransaction(t)}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:text-destructive"
                            onClick={() => handleDeleteTransaction(t.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">Categorias de Transação</h2>
            <div className="flex flex-wrap gap-2">
              {safeTypes.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 text-sm"
                >
                  <span className="text-foreground">{t.name}</span>
                  <button
                    onClick={() => openEditType(t)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteType(t.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTransaction ? "Editar Transação" : "Nova Transação"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                placeholder="Ex: Comissão Apt. Centro"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Valor (R$)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={formValor}
                onChange={(e) => setFormValor(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={formTypeId} onValueChange={setFormTypeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {safeTypes.map((t) => (
                    <SelectItem key={t.id} value={t.id.toString()}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label>É uma receita?</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{formIsProfit ? "Receita" : "Despesa"}</span>
                <Switch checked={formIsProfit} onCheckedChange={setFormIsProfit} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveTransaction}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={typeDialogOpen} onOpenChange={setTypeDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{editingType ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nome da Categoria</Label>
              <Input
                placeholder="Ex: Comissão, Marketing..."
                value={formTypeName}
                onChange={(e) => setFormTypeName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTypeDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveType}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Transactions;