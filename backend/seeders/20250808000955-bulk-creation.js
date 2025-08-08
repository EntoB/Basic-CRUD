'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const departments = [];
    for (let i = 2; i <= 1020; i++) {
      departments.push({
        name: `Department ${i}`,
        description: faker.company.catchPhrase(),
        under: i > 10 ? faker.number.int({ min: 2, max: i - 1 }) : null,
        createdAt: now,
        updatedAt: now
      });
    }

    await queryInterface.bulkInsert('Departments', departments);

    const departmentIds = Array.from({ length: 1019 }, (_, i) => i + 2);

    const batchSize = 5000;
    for (let batch = 0; batch < 10; batch++) {
      const employees = [];
      for (let i = 0; i < batchSize; i++) {
        employees.push({
          name: faker.person.fullName(),
          dateOfBirth: faker.date.between({ from: '1970-01-01', to: '2005-12-31' }),
          departmentId: departmentIds[Math.floor(Math.random() * departmentIds.length)],
          createdAt: now,
          updatedAt: now
        });
      }
      await queryInterface.bulkInsert('Employees', employees);
      console.log(`Seeded ${(batch + 1) * batchSize} employees`);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Employees', null, {});
    await queryInterface.bulkDelete('Departments', { id: { [Sequelize.Op.gte]: 2 } }, {});
  }
};
