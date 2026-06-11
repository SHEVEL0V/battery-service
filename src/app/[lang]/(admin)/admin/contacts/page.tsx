import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { notFound } from "next/navigation";
import prisma from "@/lib/db/prisma";
import { hasLocale } from "@/i18n/config";

export const dynamic = "force-dynamic";

export default async function AdminContactsPage({ params }: PageProps<"/[lang]/admin/contacts">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ mb: 4 }}>
          Contact messages
        </Typography>

        {contacts.length === 0 ? (
          <Typography color="text.secondary">No messages yet.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>{contact.name}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{contact.phone}</Typography>
                      {contact.email && (
                        <Typography variant="caption" color="text.secondary">
                          {contact.email}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{contact.message}</TableCell>
                    <TableCell>{new Date(contact.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
}
