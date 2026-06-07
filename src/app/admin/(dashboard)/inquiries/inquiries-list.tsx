"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, Phone, Calendar, Trash2, CheckCircle } from "lucide-react";
import { deleteInquiryAction, markInquiryReadAction } from "@/app/actions/inquiries";
import { useRouter } from "next/navigation";

interface InquiryItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  createdAt: Date;
}

export function InquiriesList({ initialInquiries }: { initialInquiries: InquiryItem[] }) {
  const router = useRouter();
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSelectInquiry = async (inq: InquiryItem) => {
    setSelectedInquiry(inq);
    if (inq.status === "NEW") {
      try {
        const res = await markInquiryReadAction(inq.id);
        if (res.success) {
          router.refresh();
        }
      } catch (error) {
        console.error("Failed to mark inquiry as read", error);
      }
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    setIsLoading(id);
    try {
      const res = await deleteInquiryAction(id);
      if (res.success) {
        toast.success("Inquiry deleted successfully");
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(null);
        }
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete inquiry");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Inquiries Table */}
      <Card className="border-0 shadow-sm lg:col-span-2 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Sender</TableHead>
                  <TableHead>Email/Phone</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialInquiries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      No inquiries found.
                    </TableCell>
                  </TableRow>
                ) : (
                  initialInquiries.map((inq) => (
                    <TableRow 
                      key={inq.id} 
                      onClick={() => handleSelectInquiry(inq)}
                      className={`cursor-pointer hover:bg-slate-50/80 transition-colors ${
                        selectedInquiry?.id === inq.id ? "bg-orange-50/50" : ""
                      } ${isLoading === inq.id ? "opacity-50 pointer-events-none" : ""}`}
                    >
                      <TableCell className="font-medium text-slate-900">
                        {inq.name}
                        {inq.status === "NEW" && (
                          <span className="ml-2 inline-block w-2.5 h-2.5 bg-orange-500 rounded-full" title="New Message" />
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500 space-y-0.5">
                        <div className="flex items-center"><Mail className="w-3.5 h-3.5 mr-1 text-slate-400" /> {inq.email}</div>
                        {inq.phone && (
                          <div className="flex items-center"><Phone className="w-3.5 h-3.5 mr-1 text-slate-400" /> {inq.phone}</div>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {new Date(inq.createdAt).toLocaleDateString('en-GB')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={inq.status === "NEW" ? "destructive" : "secondary"}>
                          {inq.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={(e) => handleDelete(inq.id, e)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Message Reader Panel */}
      <Card className="border-0 shadow-sm h-fit">
        <CardContent className="p-6">
          {selectedInquiry ? (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-slate-900">{selectedInquiry.name}</h3>
                <Badge variant={selectedInquiry.status === "NEW" ? "destructive" : "secondary"}>
                  {selectedInquiry.status}
                </Badge>
              </div>

              <div className="space-y-2 border-y border-slate-100 py-3 text-sm text-slate-600">
                <div className="flex items-center"><Mail className="w-4 h-4 mr-2 text-slate-400" /> {selectedInquiry.email}</div>
                {selectedInquiry.phone && (
                  <div className="flex items-center"><Phone className="w-4 h-4 mr-2 text-slate-400" /> {selectedInquiry.phone}</div>
                )}
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-slate-400" /> 
                  {new Date(selectedInquiry.createdAt).toLocaleString('en-GB')}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Message Content</h4>
                <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed min-h-[150px]">
                  {selectedInquiry.message}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400 space-y-2">
              <Mail className="w-10 h-10 mx-auto text-slate-350" />
              <p className="text-sm font-semibold">No message selected</p>
              <p className="text-xs max-w-[200px] mx-auto">Select a contact submission from the list to read details.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
