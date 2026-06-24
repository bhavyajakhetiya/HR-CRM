import prisma from '../utils/prisma.js';

// Get clients: all for admin, assigned clients for employee
export const getClients = async (req, res) => {
  try {
    const { role, id: userId } = req.user;

    let clients;
    if (role === 'admin') {
      clients = await prisma.client.findMany({
        include: {
          employee: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else if (role === 'employee') {
      clients = await prisma.client.findMany({
        where: {
          employeeId: userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      return res.status(403).json({ message: 'Forbidden: Invalid role' });
    }

    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new client (Admin only)
export const createClient = async (req, res) => {
  try {
    const { name, industry, contactName, email, phone, companyType, website, companyAddress, state, city, recruitmentPositionRequired, employeeId } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Client name is required' });
    }

    const client = await prisma.client.create({
      data: {
        name,
        industry,
        contactName,
        email,
        phone,
        companyType,
        website,
        companyAddress,
        state,
        city,
        recruitmentPositionRequired,
        employeeId: employeeId || null,
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (client.employeeId) {
      await prisma.activityLog.create({
        data: {
          action: 'Client Assigned',
          details: `Assigned client ${client.name}`,
          employeeId: client.employeeId,
          clientId: client.id
        }
      });
    }

    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing client (Admin only)
export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, industry, contactName, email, phone, companyType, website, companyAddress, state, city, recruitmentPositionRequired, employeeId } = req.body;

    const existingClient = await prisma.client.findUnique({ where: { id } });
    if (!existingClient) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Verify employee exists if employeeId is specified and not empty
    if (employeeId && employeeId !== "") {
      const employeeExists = await prisma.employee.findUnique({ where: { id: employeeId } });
      if (!employeeExists) {
        return res.status(400).json({ message: 'Assigned employee/recruiter not found' });
      }
    }

    const client = await prisma.client.update({
      where: { id },
      data: {
        name,
        industry,
        contactName,
        email,
        phone,
        companyType: companyType !== undefined ? companyType : existingClient.companyType,
        website: website !== undefined ? website : existingClient.website,
        companyAddress: companyAddress !== undefined ? companyAddress : existingClient.companyAddress,
        state: state !== undefined ? state : existingClient.state,
        city: city !== undefined ? city : existingClient.city,
        recruitmentPositionRequired: recruitmentPositionRequired !== undefined ? recruitmentPositionRequired : existingClient.recruitmentPositionRequired,
        employeeId: employeeId !== undefined ? (employeeId === "" ? null : employeeId) : existingClient.employeeId,
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const oldEmployeeId = existingClient.employeeId;
    const newEmployeeId = employeeId !== undefined ? (employeeId === "" ? null : employeeId) : oldEmployeeId;

    if (oldEmployeeId !== newEmployeeId) {
      if (oldEmployeeId) {
        await prisma.activityLog.create({
          data: {
            action: 'Client Unassigned',
            details: `Unassigned client ${existingClient.name}`,
            employeeId: oldEmployeeId,
            clientId: id
          }
        });
      }
      if (newEmployeeId) {
        await prisma.activityLog.create({
          data: {
            action: 'Client Assigned',
            details: `Assigned client ${client.name}`,
            employeeId: newEmployeeId,
            clientId: id
          }
        });
      }
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a client (Admin only)
export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    const existingClient = await prisma.client.findUnique({ where: { id } });
    if (!existingClient) {
      return res.status(404).json({ message: 'Client not found' });
    }

    await prisma.activityLog.deleteMany({ where: { clientId: id } });
    await prisma.client.delete({ where: { id } });

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign employee to a client (Admin only)
export const assignEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId } = req.body;

    const existingClient = await prisma.client.findUnique({ where: { id } });
    if (!existingClient) {
      return res.status(404).json({ message: 'Client not found' });
    }

    if (employeeId) {
      const employeeExists = await prisma.employee.findUnique({ where: { id: employeeId } });
      if (!employeeExists) {
        return res.status(400).json({ message: 'Employee not found' });
      }
    }

    const client = await prisma.client.update({
      where: { id },
      data: {
        employeeId: employeeId || null,
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const oldEmployeeId = existingClient.employeeId;
    const newEmployeeId = employeeId || null;

    if (oldEmployeeId !== newEmployeeId) {
      if (oldEmployeeId) {
        await prisma.activityLog.create({
          data: {
            action: 'Client Unassigned',
            details: `Unassigned client ${existingClient.name}`,
            employeeId: oldEmployeeId,
            clientId: id
          }
        });
      }
      if (newEmployeeId) {
        await prisma.activityLog.create({
          data: {
            action: 'Client Assigned',
            details: `Assigned client ${existingClient.name}`,
            employeeId: newEmployeeId,
            clientId: id
          }
        });
      }
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get list of all employees (Admin only, for dropdown assignment)
export const getEmployees = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
