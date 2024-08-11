from tasks import generate_monthly_report,send_daily_reminders

# Trigger the task
result = generate_monthly_report.delay()
result2 = send_daily_reminders.delay()  
# Check task status
print(result.status)
print(result2.status)
