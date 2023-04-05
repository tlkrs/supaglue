import { NotFoundError } from '@supaglue/core/errors';
import { cryptoHash, generateApiKey } from '@supaglue/core/lib/crypt';
import { fromApplicationModel } from '@supaglue/core/mappers/application';
import type { PrismaClient } from '@supaglue/db';
import { Application, ApplicationUpdateParams, ApplicationUpsertParams } from '@supaglue/types';

export class ApplicationService {
  #prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.#prisma = prisma;
  }

  public async getById(id: string): Promise<Application> {
    const application = await this.#prisma.application.findUnique({
      where: { id },
    });
    if (!application) {
      throw new NotFoundError(`Can't find application with id: ${id}`);
    }
    return fromApplicationModel(application);
  }

  public async getByIdAndOrgId(id: string, orgId: string): Promise<Application> {
    const application = await this.#prisma.application.findFirst({
      where: { id, orgId },
    });
    if (!application) {
      throw new NotFoundError(`Can't find application with id: ${id} and orgId: ${orgId}`);
    }
    return fromApplicationModel(application);
  }

  public async getByApiKey(apiKey: string): Promise<Application> {
    const { hashed: hashedApiKey } = await cryptoHash(apiKey);

    const application = await this.#prisma.application.findMany({
      where: {
        config: {
          path: ['apiKey'],
          equals: hashedApiKey,
        },
      },
    });

    if (!application || application.length === 0) {
      throw new NotFoundError(`Can't find application by api key`);
    }

    if (application.length > 1) {
      throw new Error(`Found more than one application with the same api key`);
    }

    return fromApplicationModel(application[0]);
  }

  // TODO: paginate
  public async list(orgId: string): Promise<Application[]> {
    const applications = await this.#prisma.application.findMany({ where: { orgId } });
    return applications.map(fromApplicationModel);
  }

  public async upsert(createParams: ApplicationUpsertParams): Promise<Application> {
    const upsertedApplication = await this.#prisma.application.upsert({
      where: {
        orgId_name: {
          ...createParams,
        },
      },
      create: {
        ...createParams,
        config: {
          apiKey: null,
          webhook: null,
        },
      },
      update: {
        ...createParams,
      },
    });
    return fromApplicationModel(upsertedApplication);
  }

  public async update(id: string, orgId: string, params: ApplicationUpdateParams): Promise<Application> {
    // TODO: check that org id matches
    const updatedApplication = await this.#prisma.application.update({
      where: { id },
      data: {
        ...params,
      },
    });
    return fromApplicationModel(updatedApplication);
  }

  public async createApiKey(id: string, application: ApplicationUpdateParams): Promise<Application> {
    const apiKey = generateApiKey();
    const { hashed: hashedApiKey } = await cryptoHash(apiKey);
    const updatedApplication = await this.#prisma.application.update({
      where: { id },
      data: {
        ...application,
        config: {
          ...application.config,
          apiKey: hashedApiKey,
        },
      },
    });

    return fromApplicationModel({
      ...updatedApplication,
      config: {
        ...application.config,
        apiKey, // return the unhashed api key upon creation
      },
    });
  }

  public async deleteApiKey(id: string, application: ApplicationUpdateParams): Promise<Application> {
    const updatedApplication = await this.#prisma.application.update({
      where: { id },
      data: {
        ...application,
        config: {
          ...application.config,
          apiKey: null,
        },
      },
    });

    return fromApplicationModel(updatedApplication);
  }

  public async delete(id: string, orgId: string): Promise<void> {
    // TODO: Temporarily disabling this because we cascade delete sync table
    // when we delete applications, and that doesn't add to sync_changes table,
    // so we don't know to clean up ongoing Temporal sync schedules/workflows.
    throw new Error('Not implemented');

    // Check that org matches
    await this.getByIdAndOrgId(id, orgId);
    await this.#prisma.application.delete({ where: { id } });
  }
}
