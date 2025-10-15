insert into businesses (name, type, address, latitude, longitude, avg_service_time, is_open) values
  ('City Medical Clinic','Healthcare','123 Main St, Downtown', 40.7128, -74.0060, 7, true),
  ('Luxe Hair Salon','Beauty','456 Oak Ave, Midtown', 40.7589, -73.9851, 10, true),
  ('QuickFix Auto Service','Automotive','789 Pine Rd, Eastside', 40.6892, -74.0445, 12, true),
  ('Downtown Dental Care','Healthcare','321 Broadway, Downtown', 40.7505, -73.9934, 8, true)
on conflict do nothing;
