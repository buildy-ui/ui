import { Box, Card, Stack, Title, Button, Grid } from "@ui8kit/core";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@ui8kit/form";
import { Input, Checkbox } from "@ui8kit/form";
import { useForm } from "@ui8kit/form";

export function Register() {
  const form = useForm<{ name: string; email: string; password: string; agree: boolean }>({
    defaultValues: { name: "", email: "", password: "", agree: false },
    mode: "onBlur",
  });

  const onSubmit = form.handleSubmit((values) => {
    // TODO: replace with real register action
    console.log("register submit", values);
  });

  return (
    <Box w="full" maxW="sm" mx="auto">
      <Stack gap="lg" align="center">
        <Title size="2xl" c="secondary-foreground" mt="lg">Create account</Title>
        <Card p="md" rounded="md" shadow="lg" bg="card" w="full">
          <form onSubmit={onSubmit} noValidate>
            <Form {...form}>
              <Stack gap="md">
                <Grid cols="1-2" gap="md" w="full">
                  <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: "Name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    rules={{ required: "Email is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Grid>

                <FormField
                  control={form.control}
                  name="password"
                  rules={{ required: "Password is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Choose a password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="agree"
                  rules={{ required: "Please accept the terms" }}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onChange={e => field.onChange((e.target as HTMLInputElement).checked)}
                          />
                        </FormControl>
                        <FormLabel className="m-0">I agree with the terms</FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button title="Create account" type="submit" variant="default">Create account</Button>
              </Stack>
            </Form>
          </form>
        </Card>
      </Stack>
    </Box>
  );
}


