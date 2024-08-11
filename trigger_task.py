from tasks import generate_monthly_report

# Trigger the task
result = generate_monthly_report.delay()

# Check task status
print(result.status)
