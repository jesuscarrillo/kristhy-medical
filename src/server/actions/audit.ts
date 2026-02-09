"use server";

import { cache } from "react";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { requireDoctor } from "@/server/middleware/auth";

export type AuditAction =
  | "view"
  | "create"
  | "update"
  | "delete"
  | "export"
  | "login"
  | "logout";

export type AuditEntity =
  | "patient"
  | "medical_record"
  | "appointment"
  | "prescription"
  | "medical_image"
  | "report"
  | "ultrasound"
  | "ultrasound_image"
  | "certificate";

interface LogAuditParams {
  userId: string;
  userEmail: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId?: string;
  details?: string;
}

export async function logAudit(params: LogAuditParams) {
  const headersList = await headers();
  const ipAddress =
    headersList.get("x-forwarded-for")?.split(",")[0] ||
    headersList.get("x-real-ip") ||
    "unknown";
  const userAgent = headersList.get("user-agent") || "unknown";

  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        userEmail: params.userEmail,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        details: params.details,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error("Error logging audit:", error);
  }
}

export interface AuditLogFilters {
  entity?: AuditEntity;
  action?: AuditAction;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
}

export async function getAuditLogs(filters?: AuditLogFilters, page = 1, limit = 50) {
  const safeLimit = Math.min(limit, 100);
  await requireDoctor();

  const where: Record<string, unknown> = {};

  if (filters?.entity) {
    where.entity = filters.entity;
  }
  if (filters?.action) {
    where.action = filters.action;
  }
  if (filters?.userId) {
    where.userId = filters.userId;
  }
  if (filters?.startDate || filters?.endDate) {
    where.createdAt = {
      ...(filters.startDate && { gte: filters.startDate }),
      ...(filters.endDate && { lte: filters.endDate }),
    };
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * safeLimit,
      take: safeLimit,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    logs,
    total,
    page,
    totalPages: Math.ceil(total / safeLimit),
  };
}

const _fetchAuditStats = cache(async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [totalLogs, todayLogs, weekLogs, byEntity, byAction] = await Promise.all([
    prisma.auditLog.count(),
    prisma.auditLog.count({
      where: { createdAt: { gte: today } },
    }),
    prisma.auditLog.count({
      where: { createdAt: { gte: weekAgo } },
    }),
    prisma.auditLog.groupBy({
      by: ["entity"],
      _count: { entity: true },
      orderBy: { _count: { entity: "desc" } },
    }),
    prisma.auditLog.groupBy({
      by: ["action"],
      _count: { action: true },
      orderBy: { _count: { action: "desc" } },
    }),
  ]);

  return {
    totalLogs,
    todayLogs,
    weekLogs,
    byEntity: byEntity.map((e) => ({ entity: e.entity, count: e._count.entity })),
    byAction: byAction.map((a) => ({ action: a.action, count: a._count.action })),
  };
});

export async function getAuditStats() {
  await requireDoctor();
  return _fetchAuditStats();
}
