import { Avatar, Flex, Text } from "@mantine/core"

export const IconWithText = ({
  text,
  children,
}: {
  text: string
  children: React.ReactNode
}) => {
  return (
    <Flex align="center" justify="left">
      <Avatar alt={text}>{children}</Avatar>
      <Text ml="md">{text}</Text>
    </Flex>
  )
}
