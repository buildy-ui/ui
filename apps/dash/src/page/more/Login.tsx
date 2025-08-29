import { Box, Card, Stack, Title, Button } from "@ui8kit/core";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@ui8kit/form";
import { Input } from "@ui8kit/form";
import { useForm } from "@ui8kit/form";

export function Login() {
  const form = useForm<{ email: string; password: string }>({
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  const onSubmit = form.handleSubmit((values) => {
    // TODO: replace with real auth action
    console.log("login submit", values);
  });

  return (
    <Box w="full" maxW="sm" mx="auto">
      <Stack gap="lg" align="center">
        <Title size="2xl" c="secondary-foreground" mt="lg">Sign in</Title>
        <Card p="md" rounded="md" shadow="lg" bg="card" w="full">
          <form onSubmit={onSubmit} noValidate>
            <Form {...form}>
              <Stack gap="md">
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

                <FormField
                  control={form.control}
                  name="password"
                  rules={{ required: "Password is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" variant="default">Sign in</Button>
              </Stack>
            </Form>
          </form>
        </Card>
      </Stack>
    </Box>
  );
}


