

# --> OS -------------------------------------------------------------------------
ifneq ($(OS), Windows_NT)
	OS_NAME = $(shell uname -s)
else
	OS_NAME = OS
endif

# --> PROGRAM --------------------------------------------------------------------
PROGRAM = FT_TRANSCENDANCE
AUTHOR = Aurele / Florian / Guilhem /Henri

# ~~~~~~~~~~~~~~~~ SOURCES ~~~~~~~~~~~~~~~~

CONTAINER = $(shell docker ps -a -q)
VOLUME = $(shell docker volume ls -q)

# --> COLOR ----------------------------------------------------------------------

ifneq (,$(findstring 256color, ${TERM}))

# ~~~~~~~~~~~~~~~~~ COLORS ~~~~~~~~~~~~~~~~~

	BLACK		:= $(shell tput -Txterm setaf 0)
	RED			:= $(shell tput -Txterm setaf 1)
	GREEN		:= $(shell tput -Txterm setaf 2)
	YELLOW		:= $(shell tput -Txterm setaf 3)
	BLUE		:= $(shell tput -Txterm setaf 4)
	PURPLE		:= $(shell tput -Txterm setaf 5)
	CYAN		:= $(shell tput -Txterm setaf 6)
	WHITE		:= $(shell tput -Txterm setaf 7)
	END			:= $(shell tput -Txterm sgr0)
	UNDER		:= $(shell tput -Txterm smul)
 	BOLD		:= $(shell tput -Txterm bold)
	rev			:= $(shell tput -Txterm rev)

# 	# ~~~~~~~~~~~~ BACKGROUND COLORS ~~~~~~~~~~~~

	IBLACK		:= $(shell tput -Txterm setab 0)
	IRED		:= $(shell tput -Txterm setab 1)
	IGREEN		:= $(shell tput -Txterm setab 2)
	IYELLOW		:= $(shell tput -Txterm setab 3)
	IBLUE		:= $(shell tput -Txterm setab 4)
	IPURPLE		:= $(shell tput -Txterm setab 5)
	ICYAN		:= $(shell tput -Txterm setab 6)
	IWHITE		:= $(shell tput -Txterm setab 7)

else
	BLACK		:= ""
	RED			:= ""
	GREEN		:= ""
	YELLOW		:= ""
	LIGHTPURPLE	:= ""
	PURPLE		:= ""
	BLUE		:= ""
	WHITE		:= ""
	END			:= ""
endif

# # --> RULES ----------------------------------------------------------------------

all:   header build start

# ~~~~~~~~~~~~~~~~~ BUILD ~~~~~~~~~~~~~~~~~

build :
	printf "%-62b%b" "$(CYAN) Create volumes folder$(END)$(patsubst $(SRC_DIR)/%,%,$<)"
	mkdir -p device temp
	printf "$(GREEN)[✓]$(END)\n\n"
	printf "$(CYAN) Building containers$(END)\n"
	docker-compose -f docker-compose.yml build
	docker-compose -f docker-compose.yml create

# ~~~~~~~ START ~~~~~~~~

start :	
	printf "$(GREEN) Starting containers$(END)\n"
	docker-compose -f docker-compose.yml start

# ~~~~~~~~~~~~~~~ STOP ~~~~~~~~~~~~~~~

stop clean:
	printf "$(PURPLE) Stoping containers$(END)\n"
	docker-compose -f docker-compose.yml stop
	([ cp -rf .temp back/app/src 2> /dev/null -eq 0 ] && printf "Color : $(YELLOW) Copy temp file to src with Success$(END)\n") || echo -n

# ~~~~~~~~~~~~ CLEANNING RULES ~~~~~~~~~~~~

fclean purge : clean
	printf "$(RED) Removing containers$(END)\n"
	docker system prune -af
	printf "$(RED) Removing volumes$(END)\n"
	docker volume prune -f

# ~~~~~~~~~~~~~~ REMAKE RULE ~~~~~~~~~~~~~~
re: fclean all

# --> HEADER ---------------------------------------------------------------------

header :
	@printf "████████╗██████╗  █████╗ ███╗   ██╗███████╗ ██████╗███████╗███╗   ██╗██████╗ ███████╗███╗   ██╗ ██████╗███████╗\n"
	@printf "╚══██╔══╝██╔══██╗██╔══██╗████╗  ██║██╔════╝██╔════╝██╔════╝████╗  ██║██╔══██╗██╔════╝████╗  ██║██╔════╝██╔════╝\n"
	@printf "   ██║   ██████╔╝███████║██╔██╗ ██║███████╗██║     █████╗  ██╔██╗ ██║██║  ██║█████╗  ██╔██╗ ██║██║     █████╗  \n"
	@printf "   ██║   ██╔══██╗██╔══██║██║╚██╗██║╚════██║██║     ██╔══╝  ██║╚██╗██║██║  ██║██╔══╝  ██║╚██╗██║██║     ██╔══╝  \n"
	@printf "   ██║   ██║  ██║██║  ██║██║ ╚████║███████║╚██████╗███████╗██║ ╚████║██████╔╝███████╗██║ ╚████║╚██████╗███████╗\n"
	@printf "   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝ ╚═════╝╚══════╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚═╝  ╚═══╝ ╚═════╝╚══════╝\n"

	echo
	echo "Author :" $(AUTHOR)
ifeq ($(OS_NAME), Linux)
	echo "Last modification :" `ls --time-style=long-iso  -la1rt | awk '{print $$6, $$7, $$9, $$8}' | tail -n 1`
else
	echo "Last modification :" `ls -T -la1rt | tail -n 1`
endif
	@printf "\n\n"

show debug:
	printf "Program name : %s\n"		$(PROGRAM)
	printf "Author : %s\n"				$(AUTHOR)
ifneq (,$(PROGRAM))
	printf "Color : $(GREEN)active$(END)\n"
else
		printf "Color : disable\n"
endif

help :
	echo "Generic Makefile for my C/C++ Projects\n"
	echo "Usage : make [arg]\n"
	echo "Argument :\n"
	echo "	all			(=make) compile and link"
	echo "	clean		remove objects and dependencies"
	echo "	fclean		remove objects, dependencies and the executable"
	echo "	debug		show variables (for debug use only)"
	echo "	show		same as the debug argument"
	echo "	help		printing help message"

.PHONY: all clean fclean re header show
.SILENT: