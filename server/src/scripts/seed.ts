import pool from '../db';

const seed = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Clear existing data
    await client.query('DELETE FROM campaigns');

    const campaigns = [
      {
        title: 'Campaign 1',
        message: 'This is campaign 1 <br>Clear understanding of your <b style="color: red;">goals</b>, <br>with a clear focus on <b style="color: red;">communication</b>.',
        button_url: 'https://bbdsoftware.com/',
        unredacted_image_url: '/uploads/masked_image.png',
        redacted_image_url: '/uploads/target1.webp',
        is_active: true
      },
      {
        title: 'Campaign 2',
        message: 'This is campaign 2 <br>Clear understanding of your <b style="color: red;">goals</b>, <br>with a clear focus on <b style="color: red;">communication</b>.',
        button_url: 'https://bbdsoftware.com/',
        unredacted_image_url: '/uploads/display2.webp',
        redacted_image_url: '/uploads/target2.webp',
        is_active: true
      },
      {
        title: 'Campaign 3',
        message: 'This is campaign 3 <br>Clear understanding of your <b style="color: red;">goals</b>, <br>with a clear focus on <b style="color: red;">communication</b>.',
        button_url: 'https://bbdsoftware.com/',
        unredacted_image_url: '/uploads/display1.webp', // Using display1.webp as display3.webp was missing
        redacted_image_url: '/uploads/target1.webp',
        is_active: false
      }
    ];

    for (const camp of campaigns) {
      await client.query(
        `INSERT INTO campaigns (title, message, button_url, unredacted_image_url, redacted_image_url, is_active)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [camp.title, camp.message, camp.button_url, camp.unredacted_image_url, camp.redacted_image_url, camp.is_active]
      );
    }

    await client.query('COMMIT');
    console.log('Seeding completed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding database:', error);
  } finally {
    client.release();
    await pool.end();
  }
};

seed();
